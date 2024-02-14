import { AbilityBuilder, Ability } from '@casl/ability'
import { PERMISSION_CONSTANTS } from 'src/@core/static/app.constant'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: string, subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (role === 'Admin' || role === 'admin') {
    can('manage', 'all')
  } else if (role === 'developer') {
    rulesForDeveloper(can);
  } else if (role === 'workspace-admin') {
    rulesForWorkspaceAdmin(can);
  } else {
    can(['read', 'create', 'update', 'delete'], subject)
  }
  return rules
}

const rulesForWorkspaceAdmin = (can: any) => {
  can('read', PERMISSION_CONSTANTS.workspace)
  can('read', PERMISSION_CONSTANTS.addWorkspace)
  can('read', PERMISSION_CONSTANTS.workspaceSettings)
  can('read', PERMISSION_CONSTANTS.security)
  can('read', PERMISSION_CONSTANTS.document)
  can('read', PERMISSION_CONSTANTS.appDashboard)
  can('read', PERMISSION_CONSTANTS.deleteApp)
  can('read', PERMISSION_CONSTANTS.profile)
  can('read', PERMISSION_CONSTANTS.createApp)
  can('read', PERMISSION_CONSTANTS.editProfile)
}

const rulesForDeveloper = (can: any) => {
  can('read', PERMISSION_CONSTANTS.workspace)
  can('read', PERMISSION_CONSTANTS.security)
  can('read', PERMISSION_CONSTANTS.document)
  can('read', PERMISSION_CONSTANTS.appDashboard)
  can('read', PERMISSION_CONSTANTS.profile)
  can('read', PERMISSION_CONSTANTS.createApp)
  can('read', PERMISSION_CONSTANTS.editProfile)
}

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
